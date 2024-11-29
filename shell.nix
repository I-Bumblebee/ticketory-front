{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_22
    bun
  ];

  shellHook = ''
    echo "Shell is ready. Run 'bun install' to install dependencies."
  '';
}

